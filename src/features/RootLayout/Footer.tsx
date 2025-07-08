const copyrightYear = new Date().getFullYear();
const gustoURL = "https://gusto.com/";

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
          href={gustoURL}
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gusto
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
