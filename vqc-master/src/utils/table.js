function tableform(dimensionI) {
  dimensionI.forEach((dim, i) => {
    dim.forEach((element, j) => {
      if (!element) {
        dimensionI[i][j] = '&nbsp';
      }
    });
  });
  if (dimensionI[0][0]) {
    let string =
      '<table border="1px solid #E0E0E0" style="font-style:SimHei; border:hidden; border-collapse:collapse; color: #424242; background:#F5F5F5;";>';
    function formhelp(dimensionII, num) {
      if (num === 0) {
        string = `${string}<tr style="">`;
        dimensionII.forEach(element => {
          string = `${string}<td style = " padding-left:30px; padding-right: 30px; padding-top: 10px; padding-bottom: 10px">${element}</td>`;
        });
        string = `${string}</tr>`;
      } else if (num === 1) {
        string = `${string}<tr style="font-weight:bold">`;
        dimensionII.forEach(element => {
          string = `${string}<td style = " padding-left:30px; padding-right: 30px; padding-top: 10px; padding-bottom: 10px">${element}</td>`;
        });
        string = `${string}</tr>`;
      } else {
        string = `${string}<tr style="font-weight:bold">`;
        dimensionII.forEach(element => {
          string = `${string}<td style = " padding-left:30px; padding-right: 30px; padding-top: 10px; padding-bottom: 10px">${element}</td>`;
        });
        string = `${string}</tr>`;
      }
    }
    dimensionI.forEach(row => {
      formhelp(row);
    });
    string = `${string}</table>`;
    return string;
  }
}
export default tableform;
