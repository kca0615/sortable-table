const copyrightYear = new Date().getFullYear();
const companyURL = "https://company.com/";

export default function Footer() {
  return (
    <footer className="bg-background shadow p-4 sm:p-6 xl:p-8">
      <p
        className={`
          mb-4 sm:mb-0
          text-sm text-center text-text-primary
        `}
      >
        &copy; {copyrightYear}{" "}
        <a
          href={companyURL}
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Company
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
