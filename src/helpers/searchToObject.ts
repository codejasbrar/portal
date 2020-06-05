const searchToObject = (searchString: string) => {
  const params: any = {};
  searchString.slice(1).split('&').map((prop: string) => {
    const param = prop.split('=');
    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1])
  });
  return params;
};
export default searchToObject;