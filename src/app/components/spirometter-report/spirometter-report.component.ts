import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { WebElementPromise } from 'selenium-webdriver';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-spirometter-report',
  templateUrl: './spirometter-report.component.html',
  styleUrls: ['./spirometter-report.component.css']
})
export class SpirometterReportComponent implements OnInit {

  sessions: any[] = [];
  athleteName: string;
  today: number = Date.now();
  nombreTipo: string;
  timeInterval;
  imageUrl: string;
  infoUsuario: any = {
    nombre: '',
    apellido: '',
    peso: 0,
    estatura: 0,
    sexo: ''
  }
  fechaInicio: number;

  dataSesion: any[] = [];

  /**INFO PARA REPORTES */
  volMaxExhalado = 0;
  volMinExhalado = 0; 
  volMaxInhalado = 0;
  volMinInhalado = 0;
  promVolExhalado = 0;
  promVolInhalado = 0; 
  vo2max = 0;
  //Datasets para charts
  public oxygenLineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];


  public oxygenLineChartLabels: Label[] = [];

  //Extra data for charts  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'purple',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: 'blue',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  constructor(private httpService: ApiService,
    private route: ActivatedRoute,
    private router: Router) {
    this.fillData();
    this.oxygenLineChartData[0].label = "Volumen de Oxigeno (Litros)";
    let idSesion = Number(this.route.snapshot.paramMap.get('idSesion'));
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
    this.httpService.obtenerDatos(idAtleta, 2, idSesion).subscribe(
      (result: any) => {
        this.dataSesion = [];

        for (let elemento of result.data.resultado) {
          this.dataSesion.push((elemento));
        }

        this.fillChartData(idSesion);

      },
      (error: any) => {
        console.log(error);

      });
  }


  fillData() {
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));

    this.httpService.obtenerInfoAtleta(idAtleta).subscribe(
      (result: any) => {
        this.infoUsuario = result.resultado;
      },
      (error: any) => {
        console.log(error);
      }
    )

    let idSesion = Number(this.route.snapshot.paramMap.get("idSesion"));
    this.httpService.obtenerInfoSesion(idSesion).subscribe(
      (result: any) => {
        console.log('Fecha de sesion')
        console.log(result);
        this.fechaInicio = Date.parse(result.resultado.fecha_hora);
        
      },
      (error) => {
        console.log(error);
      }
    )
  }


  fillChartData(idSesion) {

    this.httpService.obtenerDatos(0, 0, idSesion).subscribe(
      (result: any) => {
        console.log(result);
        this.dataSesion = [];
        this.oxygenLineChartData[0].data = [];
        this.oxygenLineChartLabels = []
        for (let elemento of result.data.resultado) {
          this.dataSesion.push(elemento);
        }
        this.calcularReportes();
        console.log(this.dataSesion);
        for (let elemento of this.dataSesion) {
          if (elemento.medida == 1) {
            this.oxygenLineChartData[0].data.push(elemento.valor * -1);
            this.oxygenLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);

          } else if (elemento.medida == 2) {
            this.oxygenLineChartData[0].data.push(elemento.valor);
            this.oxygenLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);

          }
        }


      },
      (error) => {
        console.log(error);
      }
    )
  }

  calcularReportes(){
    this.volMaxExhalado = 0;
    this.volMinExhalado = 500;
    this.volMaxInhalado = 0;
    this.volMinInhalado = 500;
    this.promVolExhalado = 0;
    this.promVolInhalado = 0;
    let totalInhalado = 0;
    let totalExhalado = 0;
    let vecesExhaladas = 0;
    let vecesInhaladas = 0;
    
    for(let element of this.dataSesion){
        if(element.medida == 1){  //AIRE EXHALADO
          
          vecesExhaladas++;
          if(element.valor < this.volMinExhalado){
            this.volMinExhalado = element.valor;
          }
          if(element.valor > this.volMaxExhalado){
            this.volMaxExhalado = element.valor;
          }
          totalExhalado += element.valor;

        }else if(element.medida == 2){ //AIRE INHALADO
          vecesInhaladas++;
          if(element.valor < this.volMinInhalado){
            this.volMinInhalado = element.valor;
          }
          if(element.valor > this.volMaxInhalado){
            this.volMaxInhalado = element.valor;
          }
          totalInhalado += element.valor;
        }
    }
    this.promVolExhalado = totalExhalado / vecesExhaladas;
    this.promVolInhalado = totalInhalado / vecesInhaladas;
    this.vo2max = totalInhalado * 1000 / this.infoUsuario.peso / 5;
  }


  ngOnInit(): void {
  }

}
