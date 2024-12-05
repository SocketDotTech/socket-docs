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
                title="Writing Apps in SOCKET"
                description="See how to build a chain-abstracted ERC20 airdrop application"
                link="/writing-apps"
            />
            <CardItem
                title="Architecture"
                description="Deep dive into Socket Protocol's technical architecture"
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
