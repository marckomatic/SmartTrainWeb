import { AfterViewInit, Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-homecoach',
  templateUrl: './homecoach.component.html',
  styleUrls: ['./homecoach.component.css']
})
export class HomecoachComponent implements AfterViewInit {

  coachName: string;
  assignedAthletes: Athlete[];
  unassignedAthletes: Athlete[];
  today: number = Date.now();
  timeInterval;

  displayedColumns = ["nombre", "apellido", "detalles"];
  dataSource: MatTableDataSource<Athlete>;

  displayedColumnsForSecondTable = ["nombre", "apellido", "detalles"]
  dataSourceForSecondTable: MatTableDataSource<Athlete>;

  @ViewChild('assignedTablePaginator', { read: MatPaginator }) assignedTablePaginator: MatPaginator;
  @ViewChild('unassignedTablePaginator', { read: MatPaginator }) unassignedTablePaginator: MatPaginator;

  constructor(private myAuth: AuthService,
    private http: ApiService,
    private _snackbar: MatSnackBar,
    private router: Router) {
    let userInfo = this.myAuth.getInfo();
    this.coachName = userInfo.nombre + ' ' + userInfo.apellido;

    //Filling assigned athletes table. 
    this.assignedAthletes = [];
    this.dataSource = new MatTableDataSource(this.assignedAthletes);
    this.updateAsignedAthletesTable();
    //Filling unassigned athletes table. 
    this.unassignedAthletes = [];
    this.dataSourceForSecondTable = new MatTableDataSource(this.assignedAthletes);
    this.updateUnassignedAthletesTable();
    
    this.timeInterval = setInterval(()=>{this.updateTime()}, 1000);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.assignedTablePaginator;
    this.dataSourceForSecondTable.paginator = this.unassignedTablePaginator;
  }

  //logical methods 

  updateAsignedAthletesTable() {
    let idCoach = this.myAuth.getUserId();
    this.http.getAtletasAsignados(idCoach).subscribe(
      (result: any) => {
        this.dataSource = new MatTableDataSource(result.resultado as Athlete[]);
        this.dataSource.paginator = this.assignedTablePaginator;
      },
      (error: any) => {
        console.log(error);
        if (error.status == 400) {
          this.showSnackBar(error.error.mensaje)
        } else if (error.status == 500) {
          this.showSnackBar("Error de conexión con el servidor.")
        } else {
          this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")
        }
      }
    )
  }

  updateUnassignedAthletesTable() {
    this.http.getAtletasSinCoach().subscribe(
      (result: any) => {
        this.dataSourceForSecondTable = new MatTableDataSource(result.resultado as Athlete[])
        this.dataSourceForSecondTable.paginator = this.unassignedTablePaginator;
      },
      (error) => {
        console.log(error);
        if (error.status == 400) {
          this.showSnackBar(error.error.mensaje)
        } else if (error.status == 500) {
          this.showSnackBar("Error de conexión con el servidor.")
        } else {
          this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")
        }
      }
    )
  }

  addAthlete(idAthlete:number){
    let idCoach = this.myAuth.getUserId();
    console.log("El atleta a agregar es: " + idAthlete + " al coach " + idCoach);
    this.http.asignarAtleta(idAthlete, idCoach).subscribe(
      (result:any)=>{
        this.showSnackBar("Se ha asignado al atleta.");
        this.updateAsignedAthletesTable();
        this.updateUnassignedAthletesTable();
      },
      (error:any)=>{
        console.log(error);
        if (error.status == 400) {
          this.showSnackBar(error.error.mensaje)
        } else if (error.status == 500) {
          this.showSnackBar("Error de conexión con el servidor.")
        } else {
          this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")
        }
      }
    )
  }




  //Methods to set functionality
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterToSecondTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceForSecondTable.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceForSecondTable.paginator) {
      this.dataSourceForSecondTable.paginator.firstPage();
    }
  }

  seeSessions(idAtleta:number, tipo:number){
    console.log("Si apacha el boton")
    this.router.navigate(["coach/sessions", idAtleta, tipo]);
  }

  showSnackBar(message: string) {
    this._snackbar.open(message, 'Ok', {
      duration: 2000
    });
  }

  deleteAthlete(id){
    console.log(id);
    this.http.desasignarAtleta(id).subscribe((result)=>{
      console.log(result);
      this.showSnackBar("Se ha desasignado al atleta.");
      this.updateAsignedAthletesTable();
      this.updateUnassignedAthletesTable();
    }, (error)=>{
      console.log(error);
      if (error.status == 400) {
        this.showSnackBar(error.error.mensaje)
      } else if (error.status == 500) {
        this.showSnackBar("Error de conexión con el servidor.")
      } else {
        this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")
      }
    });
  }

  updateTime(){
    this.today = Date.now();
  }
}

interface Athlete {
  idUsuario: number,
  nombre: string,
  apellido: string,
  usuario: string,
  edad: number,
  sexo: string,
  peso: number,
  estatura: number
}