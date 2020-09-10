import React from "react";

//Styles
import styles from "./Biomarkers.module.scss";
import SearchBiomarkers from "./SearchBiomarkers";

type BiomarkersPropsTypes = {};

const Biomarkers = (props: BiomarkersPropsTypes) => {


  return <section className={styles.container}>
    <div className={styles.Biomarkers}>
      <div className={styles.BiomarkersSearchWrapper}>
        <h3 className={`${styles.heading20}`}>Search biomarkers</h3>
        <SearchBiomarkers />
      </div>
      <div className={styles.BiomarkersSelectedWrapper}>
        <h3 className={styles.heading20}>Biomarkers added to lab slip</h3>
        <div className={styles.BiomarkersSelectedList}>
          No biomarkers added
        </div>
      </div>
    </div>
  </section>
};

export default Biomarkers;