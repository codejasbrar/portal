import React, {useState} from "react";

//Styles
import styles from "./Biomarkers.module.scss";
import {Panel} from "../../../interfaces/Test";
import {ReactComponent as ArrowIcon} from "../../../icons/arrow_down.svg";
import LabPanel from "./LabPanel";

type PlanPanelPropsTypes = {
  panel: Panel,
  selectable?: boolean,
  onSelect?: (panels: Panel[], flag: string) => void,
  onSelectLabPanel?: (panel: Panel) => void,
  selectedPanels?: number[]
};

const PlanPanel = (props: PlanPanelPropsTypes) => {
  const {id, code, name, labPanels} = props.panel;
  const {selectable, onSelect, selectedPanels, onSelectLabPanel} = props;
  const [listOpened, setListOpened] = useState(false);

  const selectedNow = selectedPanels?.includes(props.panel.code);

  const onChecked = () => {
    if (!listOpened && !selectedNow) setListOpened(true);
    if (listOpened && selectedNow) setListOpened(false);
    if (onSelect) {
      onSelect([props.panel, ...props.panel.labPanels as Panel[]], selectedNow ? 'remove' : 'add');
    }
  };

  const onCheckLabPanel = (panel: Panel) => {
    if (onSelectLabPanel) onSelectLabPanel(props.panel);
  };

  return <li className={styles.PlanPanel} key={`${id}_${code}`}>
    <div className={styles.PlanPanelName}>
      <p className={styles.PlanPanelNameBtn}>
        <button type={"button"} className={styles.PlanPanelAdd} onClick={() => onChecked()}>
          <span className={`${styles.PlanPanelAddDot} ${selectedPanels?.includes(props.panel.code) ? '' : styles.PlanPanelAddDotRed}`} />
        </button>
        <span className={styles.PanelPlanText}>{name}</span>
      </p>
      {labPanels &&
      <button className={`${styles.PlanPanelBtn} ${listOpened && selectedNow ? styles.PlanPanelBtnOpened : ''}`}
        onClick={() => setListOpened(!listOpened)}
        type={'button'}><ArrowIcon /></button>}
    </div>
    {labPanels && listOpened && <ul className={styles.PlanPanelList}>
      <p className={styles.PlanPanelListTitle}>Lab panels:</p>
      {labPanels.map(panel => <LabPanel key={`${code}-${id}-${panel.code}`} selectedPanels={selectedPanels}
        onSelect={onCheckLabPanel}
        selectable
        panel={panel} />)}
    </ul>}
  </li>
};

export default PlanPanel;