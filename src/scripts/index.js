import '../styles/index.scss';

const init = data => {
  const groups = creatBarGroup(data);
  showYear(groups);
  showBaseLine(groups);
  showBars(groups);
  showBarValue(groups);
  showCurrencyName(groups);
  showAxis(svg);

  let currentLeft = 0;
  const chart = document.getElementsByTagName(`svg`)[0];
  chart.addEventListener(`wheel`, e => {
    currentLeft += e.deltaY * -1;
    if (currentLeft > 0) currentLeft = 0;
    if (currentLeft < -1000) currentLeft = -1000;
    chart.style.left = `${currentLeft}px`;
    console.log('--------');
    console.log(currentLeft);
    console.log('--------');
  });
};

var data = d3.csvParse(
  `Series Name,Series Code,Time,Time Code,Indonesia,Philippines,Vietnam,Thailand,Malaysia
GDP growth (annual %),NY.GDP.MKTP.KD.ZG,2013,YR2013,5.55726368891013,7.06402426381545,5.42188299130713,2.68737991886854,4.6937225201998
GDP growth (annual %),NY.GDP.MKTP.KD.ZG,2014,YR2014,5.006668425755,6.1452987858692,5.98365463697851,0.984414063833114,6.00672194999372
GDP growth (annual %),NY.GDP.MKTP.KD.ZG,2015,YR2015,4.87632230022122,6.0665489034551,6.67928878891431,3.02017399321757,5.02800634896177
GDP growth (annual %),NY.GDP.MKTP.KD.ZG,2016,YR2016,5.0332795915301,6.87571482288942,6.21081166789989,3.28268307477235,4.21985131964395
GDP growth (annual %),NY.GDP.MKTP.KD.ZG,2017,YR2017,5.06768027408975,6.68451750279448,6.8122456596398,3.90297504194695,5.90176922237052
`,
  function(d, i) {
    const temp = {
      year: d[`Time`],
      values: [],
    };

    const values = temp.values;
    [
      `Indonesia`,
      `Malaysia`,
      `Philippines`,
      `Thailand`,
      `Vietnam`,
    ].forEach(key =>
      values.push({
        name: key,
        value: +d[key],
      })
    );

    return temp;
  }
);

//建立svg繪圖區域
const svg = d3
  .select(`body`)
  .append(`svg`)
  .style(`width`, `2000px`)
  .style(`height`, `80vh`);

//groups of each year
const creatBarGroup = data => {
  var groups = svg
    .selectAll(`g.bargroup`)
    .data(data)
    .enter()
    .append(`g`)
    .attr(`class`, `bargroup`)
    .style(
      `transform`,
      (d, i) => `translate(${i * 400 + 50}px, 500px)`
    );

  // .append(`line`)
  // .attr(`stroke`, `white`)
  // .attr(`x1`, 0)
  // .attr(`x2`, 2000)

  return groups;
};

// year
const showYear = groups => {
  groups
    .append(`text`)
    .text(d => d.year)
    .attr(`y`, 20)
    .style(`fill`, `white`)
    .style(`font-size`, `18px`)
    .style(`font-weight`, `bold`);
};

// 底線
const showBaseLine = groups => {
  groups
    .append(`line`)
    .attr(`x1`, 0)
    .attr(`x2`, 300)
    .attr(`y1`, -20)
    .attr(`y2`, -20)
    .style(`stroke`, `#fff`);
};

//顏色處理的scale
const colorify = d3.scaleOrdinal().range(d3.schemeSet1);

//數值處理的scale
const xScale = d3
  .scaleLinear()
  .domain([0, 4])
  .range([0, 200]);

const yScale = d3
  .scaleLinear()
  .domain([0, 7])
  .range([0, 400]);

//繪製長條圖
const showBars = groups => {
  var bars = groups
    .append(`g`)
    .attr(`class`, `bars`)
    .style(`transform`, `translateY(-70px)`)

    .selectAll(`rect.bar`)
    .data(d => d.values)
    .enter()
    .append(`rect`)

    .attr(`class`, `bar`)
    .attr(`fill`, (d, i) => colorify(i))

    .attr(`x`, (d, i) => xScale(i) + i * 10)
    .attr(`width`, 30)
    .attr(`height`, 0)
    .attr(`data-name`, d => d.name)

    .transition()
    .delay((d, i) => i * 500 + 500)
    .duration(2000)
    .ease(d3.easeElastic)
    .attr(`y`, (d, i) => {
      return -yScale(d.value);
    })
    .attr(`height`, d => yScale(d.value));
};

const showBarValue = groups => {
  var typeTexts = groups
    .selectAll(`g.number`)
    .data(d => d.values)
    .enter()
    .append(`g`)

    .append(`text`)
    .style(`fill`, `white`)
    .style(`font-size`, `12px`)

    .text(d => d.value.toFixed(2))
    .attr(`x`, (d, i) => xScale(i) + i * 10 + 10)
    .attr(`y`, (d, i) => -yScale(d.value) - 90)

    .transition()
    .delay((d, i) => i * 500)
    .duration(1000)
    .style(`opacity`, 0.6);
};

// 國家 name
const showCurrencyName = groups => {
  var typeTexts = groups
    .selectAll(`g.label`)
    .data(d => d.values)
    .enter()
    .append(`g`)

    .append(`text`)
    .style(`fill`, `white`)
    .style(`opacity`, 0)
    .style(`font-size`, `12px`)

    .text(d => d.name)

    .attr(`x`, (d, i) => xScale(i) + i * 10)
    .attr(`y`, -40)

    .transition()
    .delay((d, i) => i * 500)
    .duration(1000)
    .style(`opacity`, 0.6);
};

//y座標軸
const showAxis = svg => {
  const axisGroup = svg
    .append(`g`)
    .attr(`class`, `axis`)
    .style(`transform`, `translateY(450px)`)
    .selectAll(`line.axis`)
    .data(d3.range(7).map(d => d))
    .enter();

  axisGroup
    .append(`line`)
    .attr(`class`, `axis`)
    .attr(`stroke`, `white`)
    .attr(`x1`, 0)
    .attr(`x2`, 2000)
    .attr(`y1`, (d, i) => -yScale(d) - 20)
    .attr(`y2`, (d, i) => -yScale(d) - 20)
    .attr(`stroke-dasharray`, `5 5`)
    .style(`opacity`, 0.3);

  axisGroup
    .append(`text`)
    .text(d => d)
    .attr(`x`, 0)
    .attr(`y`, (d, i) => -yScale(d) - 15)
    .attr(`fill`, `white`)
    .style(`opacity`, 0.5)
    .style(`font-size`, `16px`);
};

init(data);
