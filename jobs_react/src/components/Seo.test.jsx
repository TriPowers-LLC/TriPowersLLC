import { render } from "@testing-library/react";
import Seo from "./Seo";

describe("Seo", () => {
  test("sets unique canonical, sharing, and image metadata", () => {
    render(
      <Seo
        title="AI & Cloud Services"
        description="TriPowers service description"
        path="/services"
        imageAlt="TriPowers service team"
      />
    );

    expect(document.title).toBe("AI & Cloud Services | TriPowers LLC");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.tripowersllc.com/services"
    );
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      "TriPowers service team"
    );
  });

  test("supports noindex metadata for secure routes", () => {
    render(
      <Seo
        title="Secure Account"
        description="Secure account access"
        path="/login"
        robots="noindex,nofollow"
      />
    );

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow"
    );
  });
});
