import DynamicFooter from "@/components/layout/DynamicFooter";
import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <DynamicFooter />
    </>
  )
}