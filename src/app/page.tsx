import PasswordGenerator from "@/components/PasswordGenerator";
import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <main className=" min-h-screen">
      <Container>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <PasswordGenerator />
        </div>
      </Container>
    </main>
  );
}
