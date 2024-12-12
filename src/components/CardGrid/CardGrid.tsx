import React from 'react';
import Link from '@docusaurus/Link';
import styles from './CardGrid.module.css';

const CardItem = ({ title, description, link, }) => (
    <Link to={link} className={styles.cardLink}>
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
            </div>
        </div>
    </Link>
);

function GettingStartedGrid() {
    return (
        <div className={styles.cardGrid}>
            <CardItem
                title="Getting Started"
                description="Follow a step by step tutorial"
                link="/getting-started"
            />
            <CardItem
                title="App Tutorial"
                description="Build a chain-abstracted ERC20 airdrop app"
                link="/writing-apps"
            />
            <CardItem
                title="Architecture"
                description="Deep dive into SOCKET Protocol's architecture"
                link="/architecture"
            />
            <CardItem
                title="Usecases"
                description="Read more about the usecases SOCKET enables"
                link="/usecases"
            />
        </div>
    );
}

export default GettingStartedGrid;
