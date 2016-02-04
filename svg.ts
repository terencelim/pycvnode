class SvgElement {

  svg : SVGSVGElement ;
  x : number ;
  y : number ;

  connectors : Array<Connector> ;

  constructor(svg : SVGSVGElement) {
    this.svg = svg ;
  }

  createElementNS(name : string, attributs ) : SVGDefsElement {
    var svgNS = "http://www.w3.org/2000/svg";
    var elem = document.createElementNS(svgNS,name);
    for( var item in attributs ) {
      elem.setAttributeNS(null, item, attributs[item] );
    }
    return (<SVGDefsElement>elem) ;
  }

  getSize() {
    return this.svg.getBoundingClientRect();
  }


}

class SvgNode extends SvgElement {

  name : string ;
  g : SVGDefsElement ;
  circle : SVGDefsElement ;

  constructor( svg : SVGSVGElement, data ) {
    super(svg);
    this.name = data.name ;
    for( var con of data.connectors ) {
      var tmp = new Connector( svg, con );
      this.connectors.push(tmp);
    }
  }

  //Generate svg code
  generate(data) {
    var svgNS = "http://www.w3.org/2000/svg";
    this.g = <SVGDefsElement>document.createElementNS(svgNS,"g");
    this.circle = this.createElementNS("rect", { 'rx' : 10, 'ry' : 10,
      'width' : 180, 'height' : 200,
      'fill' : '#848484', 'stroke' : 'black',
       });

    this.g.setAttributeNS(null,'onmousedown',"onMouseDown(evt);");
    //mouse selection is not match with g element !
    //this.circle.setAttribute('data',this);
    (<any>this.circle).data = this ;
    this.svg.appendChild(this.g);
    this.g.appendChild(this.circle);
    this.addText(data.name);
  }

  addText(txt:string) {
    var text = this.createElementNS("text", { 'x':15, 'y':20, 'fill' : 'black' });
    text.textContent = txt ;
    this.g.appendChild(text);
  }

  move( x : number, y : number ) {
    var pt = this.svg.createSVGPoint();
    pt.x = x ; pt.y = y ;
    var pt_loc = pt.matrixTransform(this.svg.getScreenCTM().inverse())
    this.x = pt_loc.x - this.getSize().width / 2 ;
    this.y = pt_loc.y - this.getSize().height / 2 ;
    var translate = '(' + this.x + ',' + this.y  + ')';
    this.g.setAttribute('transform','translate' + translate )
  }

  getSize() {
    return this.g.getBoundingClientRect();
  }
}

class Connector extends SvgElement {

  name : string ;

  constructor( svg : SVGSVGElement, data ) {
    super(svg);
    this.name = data.name ;
  }
}