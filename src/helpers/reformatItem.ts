import {Order} from "../interfaces/Order";
import {TestDetails} from "../interfaces/Test";

const reformatItem = (order: Order | TestDetails): any => {
  const offsetHours = new Date().getTimezoneOffset() / 60;
  const dateReceived = new Date(order.received);
  const dateApproved = order.approved ? new Date(order.approved) : '';
  const dateObserved = order.observed ? new Date(order.observed) : '';
  dateReceived.setHours(dateReceived.getHours() - offsetHours);
  if (dateApproved) dateApproved.setHours(dateApproved.getHours() - offsetHours);
  if (dateObserved) dateObserved.setHours(dateObserved.getHours() - offsetHours);
  return {
    ...order,
    criteriaMet: order.criteriaMet ? "Yes" : 'No',
    received: `${dateReceived.getMonth() + 1}/${dateReceived.getDate()}/${dateReceived.getFullYear()}T${dateReceived.toLocaleTimeString()}`,
    approved: dateApproved ? `${dateApproved.getMonth() + 1}/${dateApproved.getDate()}/${dateApproved.getFullYear()}T${dateApproved.toLocaleTimeString()}` : '',
    observed: dateObserved ? `${dateObserved.getMonth() + 1}/${dateObserved.getDate()}/${dateObserved.getFullYear()}T${dateObserved.toLocaleTimeString()}` : ''
  }
};

export default reformatItem;
