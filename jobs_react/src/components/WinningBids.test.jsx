import { render, screen } from "@testing-library/react";
import WinningBids from "./WinningBids";

describe("WinningBids product page", () => {
  test("publishes verified product, tool, and social links", () => {
    render(<WinningBids />);

    expect(
      screen.getByRole("heading", { level: 1, name: "WinningBids.ai" })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Explore WinningBids.ai/i })).toHaveAttribute(
      "href",
      "https://winningbids.ai/"
    );
    expect(screen.getByRole("link", { name: /Try Free GovCon Tools/i })).toHaveAttribute(
      "href",
      "https://winningbids.ai/tools/bid-no-bid-calculator"
    );
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/winningbids"
    );
    expect(screen.getByRole("link", { name: /Facebook/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  test("sets product metadata and structured data", () => {
    render(<WinningBids />);

    expect(document.title).toContain("AI for Government Contracting");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.tripowersllc.com/products/winningbids"
    );
    expect(document.getElementById("page-structured-data")?.textContent).toContain(
      '"SoftwareApplication"'
    );
  });
});
