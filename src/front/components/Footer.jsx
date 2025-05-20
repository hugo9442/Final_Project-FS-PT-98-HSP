export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © {new Date().getFullYear()} Copyright:
        <a
          className="text-body ms-1"
          href="https://mdbootstrap.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trabajo Final Hugo - Pablo - Stiven
        </a>
      </div>
	</footer>
);
