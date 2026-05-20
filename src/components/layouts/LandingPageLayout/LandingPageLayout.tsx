
import LandingPageLayoutFooter from "./LandingPageLayoutFooter/LandingPageLayoutFooter";
import type { ReactNode } from "react";
import LandingPageLayoutNavbar from "./LandingPageNavbar/LandingPageLayoutNavbar";

interface PropTypes {
  children: ReactNode;
}

const LandingPageLayout = (props: PropTypes) => {
  const { children } = props;

  return (
    <>
      <LandingPageLayoutNavbar />
      <div className="bg-[#f9f9f9]">{children}</div>
      <LandingPageLayoutFooter />
    </>
  );
};

export default LandingPageLayout;