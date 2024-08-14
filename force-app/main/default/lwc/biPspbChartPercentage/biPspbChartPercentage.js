//This lightning web component takes in a percentage value and renders a circular progress chart accordingly, with the progress represented by a dynamically calculated dash array on the progress circle.
//To import Libraries
import { LightningElement, api } from 'lwc';
import { resources } from "c/biPspLabelAndResourceChallenges";


export default class BiPspbChartPercentage extends LightningElement {
  //Proper naming conventions with camel case for all the variable will be followed in the future releases
  @api percentage;
  @api currentxp;
  @api nextrankxp;
  fixedPercentage = resources.CHART_PERCENTAGE;
  // get the ProgressCircle value.
  get progressCircleStyle() 
  {
    if (this.percentage > 0) {
      const radius = 60;
      const circumference = 2 * Math.PI * radius;
      const dashArray = (this.percentage / 100) * circumference;
      return `stroke-dasharray: ${dashArray} ${circumference} ;`;
    } 
    if (this.percentage <= 0)
    {
      return `stroke-dasharray: ${this.fixedPercentage} ;`;
    }
    return null;
  }
}