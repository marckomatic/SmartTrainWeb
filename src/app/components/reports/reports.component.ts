import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = ['valor', 'fecha_hora', 'distancia_repeticion', 'velocidad'];
  failsDisplayedColumns: string[] = ['id', 'fecha_hora', 'repeticion'];

  titulo: string = "Holi";
  estado: string = "Inactivo";
  idSesion: number;
  idAtleta: number;
  tipoMedicion: number;
  fechaInicio: string;
  today: number = Date.now();
  interval;
  timeInterval;

  //Data para llenar graficas
  dataDistancia = [];
  dataVelocidad = [];
  dataBPM = [];
  dataTmp = [];
  dataRepeticiones = [];
  dataRendiciones = [];
  dataFallos = [];

  //Reportes numéricos
  velocidadPromedio = 0;
  velocidadMinima = 0;
  velocidadMaxima = 0;
  repeticion = 0;
  motivoFinalizacion = 'normalmente.';
  infoUsuario: any = {
    nombre: '',
    apellido: ''
  };
  constructor(private http: ApiService,
    private route: ActivatedRoute) {

    this.idSesion = Number(this.route.snapshot.paramMap.get('idSesion'));
    this.idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));

    this.fillData();
    this.fillInfoData();
  }


  fillData() {
    this.http.obtenerDatos(this.idAtleta, this.tipoMedicion, this.idSesion).subscribe(
      (result: any) => {
        this.dataBPM = [];
        this.dataDistancia = [];
        this.dataRepeticiones = [];
        this.dataVelocidad = [];
        this.dataTmp = [];
        console.log(result);

        for (let elemento of result.data.resultado) {
          switch (elemento.medida) {
            case 1:
              this.dataBPM.push(elemento);
              break;
            case 2:
              this.dataTmp.push(elemento);
              break;
            case 3:
              this.dataVelocidad.push(elemento);
              break;
            case 4:
              this.dataDistancia.push(elemento);
              break;
            case 5:
              elemento.velocidad = elemento.distacia_repeticion / 60;
              this.dataRepeticiones.push(elemento);
              break;
          }
        }


        //Calculating velocity
        this.velocidadPromedio = 0;
        this.velocidadMinima = this.dataVelocidad[0].valor;

        for (let elemento of this.dataVelocidad) {
          if (elemento.valor < this.velocidadMinima) {
            this.velocidadMinima = elemento.valor;
          }

          if (elemento.valor > this.velocidadMaxima) {
            this.velocidadMaxima = elemento.valor;
          }
          this.velocidadPromedio = this.velocidadPromedio + elemento.valor;
        }
        this.velocidadPromedio = this.velocidadPromedio / this.dataVelocidad.length;
      },
      (error: any) => {
        console.log(error);

      }
    )

    this.http.getDatoFallos(this.idAtleta).subscribe(
      (result:any) => {
        console.log(result);
        this.dataFallos = result.resultado;
      },
      (error) => {
        console.log(error);
      }
    )

    this.http.getDatoRendiciones(this.idAtleta).subscribe(
      (result:any) => {
        this.dataRendiciones = result.resultado;
      },
      (error) => {
        console.log(console.error()
        )
      }
    );
    

    console.log(this.dataVelocidad);


  }



  fillInfoData() {
    this.http.obtenerInfoAtleta(this.idAtleta).subscribe(
      (result: any) => {
        this.infoUsuario = result.resultado;
      },
      (error: any) => {
        console.log(error);
      }
    );

    this.http.obtenerInfoSesion(this.idSesion).subscribe(
      (result: any) => {
        this.fechaInicio = result.resultado.fecha_hora;
      }
    )

  }



  ngOnInit(): void {
  }

}
