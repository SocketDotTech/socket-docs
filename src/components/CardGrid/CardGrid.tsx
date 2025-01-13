import React from 'react';
import Link from '@docusaurus/Link';
import styles from './CardGrid.module.css';

const CardItem = ({ title, description, link }) => (
    <Link to={link} className={styles.cardLink}>
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
            </div>
        </div>
    </Link>
);

const CardGrid = ({ cards }) => (
    <div className={styles.cardGrid}>
        {cards.map((card, index) => (
            <CardItem key={index} {...card} />
        ))}
    </div>
);

export default CardGrid;
