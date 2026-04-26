import PageLayout from "@/components/layouts/page-layout";
import SearchForm from "@/components/search-form";

export default function IndexPage() {
  return (
    <PageLayout>
      <SearchForm title="도서 검색" />
    </PageLayout>
  );
}
