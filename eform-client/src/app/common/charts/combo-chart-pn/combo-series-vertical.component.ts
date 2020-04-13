import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy, ContentChild, TemplateRef
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {calculateViewDimensions, formatLabel} from '@swimlane/ngx-charts';
import { scaleBand, scaleLinear } from 'd3-scale';


@Component({
  selector: 'g[ngx-combo-charts-series-vertical]',
  templateUrl: './combo-series-vertical.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1,
          transform: '*',
        }),
        animate(500, style({opacity: 0, transform: 'scale(0)'}))
      ])
    ])
  ]
})
export class ComboSeriesVerticalComponent implements OnChanges {

  @Input() dims;
  @Input() type: string;
  @Input() series;
  @Input() results;
  @Input() seriesLine;
  @Input() xScale;
  @Input() yScale;
  @Input() innerScale;
  @Input() valueScale;
  @Input() colors;
  @Input() tooltipDisabled = true;
  @Input() gradient: boolean;
  @Input() activeEntries: any[];
  @Input() seriesName: string;
  @Input() animations = true;
  @Input() noBarWhenZero = true;
  @Input() legend = false;
  @Input() xAxis;
  @Input() yAxis;
  @Input() showXAxisLabel;
  @Input() showYAxisLabel;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() scaleType = 'ordinal';
  @Input() showGridLines: boolean;
  @Input() schemeType: string;
  @Input() trimXAxisTicks: boolean;
  @Input() trimYAxisTicks: boolean;
  @Input() rotateXAxisTicks: boolean;
  @Input() maxXAxisTickLength: number;
  @Input() maxYAxisTickLength: number;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() groupPadding = 16;
  @Input() barPadding = 8;
  @Input() roundDomains: boolean;
  @Input() roundEdges: boolean;
  @Input() yScaleMax: number;
  @Input() showDataLabel: boolean;
  @Input() dataLabelFormatting: any;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() bandwidth = new EventEmitter();

  // @ts-ignore
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;



  groupDomain: any[];
  innerDomain: any[];
  valuesDomain: any[];
  groupScale: any;
  transform: string;
  margin = [10, 0, 0, 0];

  bars: any;
  x: any;
  y: any;

  ngOnChanges(changes): void {
    this.update();
  }

  update(): void {
    this.groupDomain = this.getGroupDomain();
    this.innerDomain = this.getInnerDomain();
    this.valuesDomain = this.getValueDomain();

    this.groupScale = this.getGroupScale();
    this.innerScale = this.getInnerScale();
    this.valueScale = this.getValueScale();
    this.transform = `translate(${this.dims.xOffset}})`;

    let width;
    if (this.series.length) {
      width = this.xScale.bandwidth();
      this.bandwidth.emit(width);
    }
    let d0 = 0;
    let total;
    if (this.type === 'normalized') {
      total = this.series.map(d => d.series).reduce((sum, d) => sum + d, 0);
    }

    this.bars = this.series.map((d, index) => {
      let value = d.value;
      const label = d.name;
      const formattedLabel = formatLabel(label);
      const roundEdges = this.type === 'standard';
      const bar: any = {
        value,
        label,
        roundEdges,
        data: d,
        width,
        formattedLabel,
        height: 0,
        x: 0,
        y: 0
      };

      if (this.type === 'standard') {
        bar.height = Math.abs(this.yScale(value) - this.yScale(0));
        bar.x = this.xScale(label);

        if (value < 0) {
          bar.y = this.yScale(0);
        } else {
          bar.y = this.yScale(value);
        }
      } else if (this.type === 'stacked') {
        const offset0 = d0;
        const offset1 = offset0 + value;
        d0 += value;

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (this.type === 'normalized') {
        let offset0 = d0;
        let offset1 = offset0 + value;
        d0 += value;

        if (total > 0) {
          offset0 = (offset0 * 100) / total;
          offset1 = (offset1 * 100) / total;
        } else {
          offset0 = 0;
          offset1 = 0;
        }

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
        value = (offset1 - offset0).toFixed(2) + '%';
      }

      if (this.colors.scaleType === 'ordinal') {
        bar.color = this.colors.getColor(label);
      } else {
        if (this.type === 'standard') {
          bar.color = this.colors.getColor(value);
          bar.gradientStops = this.colors.getLinearGradientStops(value);
        } else {
          bar.color = this.colors.getColor(bar.offset1);
          bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
        }
      }

      let tooltipLabel = formattedLabel;
      if (this.seriesName) {
        tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
      }

      this.getSeriesTooltips(this.seriesLine, index);
      const lineValue = this.seriesLine[0].series[index].value;
      const lineName = this.seriesLine[0].series[index].name;
      return bar;

    });
  }
  getGroupScale(): any {
    const spacing = this.groupDomain.length / (this.dims.height / this.groupPadding + 1);
    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .paddingOuter(spacing / 2)
      .domain(this.groupDomain);
  }
  getInnerScale(): any {
    const width = this.groupScale.bandwidth();
    const spacing = this.innerDomain.length / (width / this.barPadding + 1);
    return scaleBand()
      .rangeRound([0, width])
      .paddingInner(spacing)
      .domain(this.innerDomain);
  }
  getValueScale(): any {
    const scale = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.valuesDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getGroupDomain() {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.name)) {
        domain.push(group.name);
      }
    }
    return domain;
  }

  getInnerDomain() {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.name)) {
          domain.push(d.name);
        }
      }
    }

    return domain;
  }

  getValueDomain() {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.value)) {
          domain.push(d.value);
        }
      }
    }
    const min = Math.min(0, ...domain);
    const max = this.yScaleMax ? Math.max(this.yScaleMax, ...domain) : Math.max(0, ...domain);

    return [min, max];
  }

  groupTransform(group) {
    return `translate(${this.groupScale(group.label)}, 0)`;
  }
  getSeriesTooltips(seriesLine, index) {
    return seriesLine.map(d => {
      return d.series[index];
    });
  }

  onClick(data): void {
    this.select.emit(data);
  }

  trackBy(index, item): string {
    return item.name;
  }

}
