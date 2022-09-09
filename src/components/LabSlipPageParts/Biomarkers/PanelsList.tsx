import React from "react";

//Styles
import styles from "./Biomarkers.module.scss";
import {LabPanel, PlanPanel} from "../../../interfaces/Test";
import PlanPanelComponent from "./PlanPanel";
import LabPanelComponent from "./LabPanel";

type PanelsListPropsTypes = {
  panels: Array<PlanPanel | LabPanel>,
  mode: 'lab' | 'plan' | 'all',
  selected?: string[],
  setSelected?: (codes: string[]) => void
};

const PanelsList = (props: PanelsListPropsTypes) => {
  const {panels, mode, selected, setSelected} = props;


  const onSelectPanel = (panel: PlanPanel) => {
    if (selected && setSelected) {
      if (selected.includes(panel.code)) {
        setSelected(selected.filter((code => code !== panel.code)));
      } else
        setSelected([...selected, panel.code])
    }
  };

  const onSelectPanels = (panels: PlanPanel[], flag: string) => {
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

  const onRemove = (code: string) => {
    if (selected && setSelected) setSelected(selected.filter(item => item !== code));
  };

  const onRemoveAll = () => {
    if (setSelected) setSelected([] as string[]);
  };

  switch (mode) {
    case "lab":
      return <>
        <h3 className={styles.heading20}>Lab panels:</h3>
        <ul className={styles.PanelsList}>
          {!!panels.length ? panels.map((panel: PlanPanel) => <LabPanelComponent onSelect={onSelectPanel}
            key={`${panel.code}-${panel.id}`}
            selectable
            selectedPanels={selected}
            panel={panel as LabPanel} />) : <span>No matches found...</span>}
        </ul>
      </>;
    case "plan":
      return <>
        <h3 className={styles.heading20}>Plan panels:</h3>
        <ul className={styles.PanelsList}>
          {!!panels.length ? panels.map((panel: PlanPanel) => <PlanPanelComponent key={`${panel.code}${panel.id}`}
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
          <button type={'button'} onClick={onRemoveAll}>Remove all</button>
        </div>}
        {!!panels.length && panels.map(panel => (panel as PlanPanel).labPanels ? <></> :
          <LabPanelComponent key={`${panel.code}1${panel.id}`} onRemove={onRemove} panel={panel as LabPanel} />)}
      </ul>;
    default:
      return <></>;
  }

};

export default PanelsList;
