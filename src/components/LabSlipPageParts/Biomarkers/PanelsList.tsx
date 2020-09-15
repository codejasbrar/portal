import React, {useState} from "react";

//Styles
import styles from "./Biomarkers.module.scss";
import {Panel} from "../../../interfaces/Test";
import PlanPanel from "./PlanPanel";
import LabPanel from "./LabPanel";

type PanelsListPropsTypes = {
  panels: Panel[],
  mode: 'lab' | 'plan' | 'all',
  selected?: number[],
  setSelected?: (codes: number[]) => void
};

const PanelsList = (props: PanelsListPropsTypes) => {
  const {panels, mode, selected, setSelected} = props;


  const onSelectPanel = (panel: Panel) => {
    if (selected && setSelected) {
      if (selected.includes(panel.code)) {
        setSelected(selected.filter((code => code !== panel.code)));
      } else
        setSelected([...selected, panel.code])
    }
  };

  const onSelectPanels = (panels: Panel[], flag: string) => {
    if (selected && setSelected) {
      const selectedSet = new Set(selected);
      panels.forEach(panel => {
        if (flag === 'remove') {
          selectedSet.delete(panel.code)
        } else {
          selectedSet.add(panel.code)
        }
      });
      setSelected(Array.from(selectedSet))
    }
  };

  const onRemove = (code: number) => {
    if (selected && setSelected) setSelected(selected.filter(item => item !== code));
  };

  const onRemoveAll = () => {
    if (setSelected) setSelected([] as number[]);
  };

  switch (mode) {
    case "lab":
      return <>
        <h3 className={styles.heading20}>Lab panels:</h3>
        <ul className={styles.PanelsList}>
          {!!panels.length ? panels.map(panel => <LabPanel onSelect={onSelectPanel}
            key={`${panel.code}-${panel.id}`}
            selectable
            selectedPanels={selected}
            panel={panel} />) : <span>No matches found...</span>}
        </ul>
      </>;
    case "plan":
      return <>
        <h3 className={styles.heading20}>Plan panels:</h3>
        <ul className={styles.PanelsList}>
          {!!panels.length ? panels.map(panel => <PlanPanel key={`${panel.code}${panel.id}`}
            onSelectLabPanel={onSelectPanel}
            onSelect={onSelectPanels}
            selectable
            selectedPanels={selected}
            panel={panel} />) : <span>No matches found...</span>}
        </ul>
      </>;
    case "all":
      return <ul className={styles.SelectedList}>
        {!!panels.length && <div className={`${styles.SelectedListRemove} ${styles.SelectedListRemoveAll}`}>
          <h4 className={styles.heading14}>All lab panels:</h4>
          <button type={'button'} onClick={onRemoveAll}>Clear all</button>
        </div>}
        {!!panels.length && panels.map(panel => panel.labPanels ? <></> :
          <LabPanel key={`${panel.code}1${panel.id}`} onRemove={onRemove} panel={panel} />)}
      </ul>;
    default:
      return <></>;
  }

};

export default PanelsList;