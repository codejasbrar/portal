import React, {useState} from "react";

//Styles
import styles from "./Biomarkers.module.scss";
import {Panel} from "../../../interfaces/Test";
import {ReactComponent as ArrowIcon} from "../../../icons/arrow_down.svg";
import Checkbox from "../../Checbox/Checkbox";

type LabPanelPropsTypes = {
  panel: Panel,
  selectable?: boolean,
  onSelect?: (panel: Panel) => void,
  selectedPanels?: number[],
  onRemove?: (code: number) => void
};

const LabPanel = (props: LabPanelPropsTypes) => {
  const {id, code, name, biomarkers} = props.panel;
  const {selectable, onSelect, selectedPanels, onRemove} = props;
  const [listOpened, setListOpened] = useState(false);

  const onChecked = () => {
    if (onSelect) onSelect(props.panel);
  };

  return <li className={styles.PlanPanel} key={`${id}_${code}_${id}`}>
    <div className={styles.PlanPanelName}>
      {selectable ? <Checkbox classes={{label: styles.PlanPanelCheckboxLabel}}
          name={name}
          onChange={onChecked}
          label={name}
          checked={!!(selectedPanels && selectedPanels.includes(props.panel.code))} /> :
        <p className={styles.PanelPlanText}>{name}</p>}
      {onRemove && <div className={styles.SelectedListRemove}>
        <button onClick={() => onRemove(code)} type={'button'}>Remove</button>
      </div>}
      {!!biomarkers && biomarkers.length > 1 && !onRemove &&
      <button className={`${styles.PlanPanelBtn} ${listOpened ? styles.PlanPanelBtnOpened : ''}`}
        onClick={() => setListOpened(!listOpened)}
        type={'button'}><ArrowIcon /></button>}
    </div>
    {!!biomarkers && biomarkers.length > 1 && listOpened && !onRemove && <ul className={styles.LabPanelList}>
      <p className={styles.PlanPanelListTitle}>Biomarkers:</p>
      {biomarkers.map(marker => <li className={styles.LabPanelListItem} key={marker.id}>{marker.name}</li>)}
    </ul>}
  </li>
};

export default LabPanel;