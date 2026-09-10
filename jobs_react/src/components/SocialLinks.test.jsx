import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("TriPowers social links", () => {
  test("publishes the official profiles safely", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const expectedLinks = {
      LinkedIn: "https://www.linkedin.com/company/tripowers-llc",
      Facebook: "https://www.facebook.com/profile.php?id=61575833189027",
      Instagram: "https://www.instagram.com/tripowerssolutionsllc/",
    };

    Object.entries(expectedLinks).forEach(([name, url]) => {
      const link = screen.getByRole("link", {
        name: `Follow TriPowers LLC on ${name} (opens in a new tab)`,
      });
      expect(link).toHaveAttribute("href", url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
