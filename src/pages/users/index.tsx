import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import StaffList from "@components/shop/staff-list";
import LinkButton from "@components/ui/link-button";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useUsersQuery } from "@data/user/use-users.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ROUTES } from "@utils/routes";
import SortForm from "@components/common/sort-form";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const {
    data,
    isLoading: loading,
    error,
  } = useUsersQuery({
    limit: 20,
    page,
    text: searchTerm,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">
            {t("form:text-staff")}
          </h1>
        </div>

        <div className="flex items-center w-full md:w-3/4 xl:w-2/4 ms-auto">
          <SortForm
            showLabel={false}
            className="w-full"
            onSortChange={({ value }: { value: SortOrder }) => {
              setColumn(value);
            }}
            onOrderChange={({ value }: { value: string }) => {
              setOrder(value);
            }}
            options={[
              { value: "name", label: "Name" },
              { value: "created_at", label: "Created At" },
              { value: "updated_at", label: "Updated At" },
            ]}
          />

          <LinkButton
            href={`/clothing-shop/staffs/create`}
            className="h-12 ms-4 md:ms-6"
          >
            <span className="hidden md:block">
              + {t("form:button-label-add-staff")}
            </span>
            <span className="md:hidden">+ {t("form:button-label-add")}</span>
          </LinkButton>
        </div>
      </Card>

      {loading ?  (
        <StaffList staffs={data?.staffs} onPagination={handlePagination} />
      ): null}
    </>
  );
}
Customers.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
