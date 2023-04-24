import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import { Tabs } from "../components/HomepageFeatures/Tabs";

import styles from "./index.module.css";

const SectionList = [
  {
    title: "Learn",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: <>Learn about SocketDL</>,
  },
  {
    title: "Build",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: <></>,
  },
  {
    title: "Earn",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Participate in Socket Surge, Socket's incentivised testnet program. Find
        bugs in the system, crack lootboxes and become a Socket Sentinel!
      </>
    ),
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/Learn/basics"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main className="w-full">
        {/* <HomepageFeatures /> */}

        <div className="lg:flex flex-row lg:w-full my-8 justify-center">
          {SectionList.map((section) => {
            return (
              <Tabs title={section.title} description={section.description} />
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
