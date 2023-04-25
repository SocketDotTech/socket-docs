import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
// import HomepageFeatures from "@site/src/components/HomepageFeatures";
import { Tabs } from "../components/HomepageFeatures/Tabs";
import Learn from "../../static/svg/learn.svg";
import Build from "../../static/svg/build.svg";
import Earn from "../../static/svg/earn.svg";

import styles from "./index.module.css";

const SectionList = [
  {
    title: "Learn",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Learn about Socket's architecture, messaging lifecycle, security, fees &
        more
      </>
    ),
    buttonLink: "/Learn/Basics",
    buttonIcon: Learn,
  },
  {
    title: "Build",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: <> Send your first cross-chain message in less than 5 mins</>,
    buttonLink: "/Build/TutorialSection/hello-world",
    buttonIcon: Build,
  },
  {
    title: "Earn",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>Participate in Socket's incentivised testnet & become a Sentinel</>
    ),
    buttonLink: "/Earn/Contribute",
    buttonIcon: Earn,
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={`${clsx("hero", styles.heroBanner)} text-white`}
      style={{ backgroundImage: 'url("./img/header-bg.png")' }}
    >
      <div className="container">
        <h1 className="md:text-5xl sm:text-xl">{siteConfig.title}</h1>
        <p className="md:text-xl sm:text-lg">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/category/learn"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="bg-global">
      <Layout
        title={`Hello from ${siteConfig.title}`}
        description="Description will go into a meta tag in <head />"
      >
        <HomepageHeader />
        <main className="w-full">
          {/* <HomepageFeatures /> */}

          <div className="flex flex-col lg:flex-row lg:w-full my-8 justify-center items-center">
            {SectionList.map((section) => {
              return (
                <Tabs
                  title={section.title}
                  description={section.description}
                  buttonLink={section.buttonLink}
                  tabIcon={section}
                />
              );
            })}
          </div>
        </main>
      </Layout>
    </div>
  );
}
