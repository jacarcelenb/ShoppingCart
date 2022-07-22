import { Component, Input, OnInit } from '@angular/core';
import { ModelCiudad } from 'src/app/model/model.ciudad';
import { ModelCliente } from 'src/app/model/model.cliente';
import { ModelEstadoCivil } from 'src/app/model/model.state';
import { ClientesService } from 'src/app/service/clientes.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() clienteData = {
    per_rol: 2,
    per_cedula: '',
    per_nombres: '',
    per_direccion: '',
    per_telefono: '',
    per_correo: '',
    per_clave: '',
    per_estado: true,
    per_estadocivil: '',
    per_ciudad: ''
  }

  constructor(private clienteService: ClientesService ,
    private router: Router) {
  }

  ciudades: ModelCiudad[] = [];
  estado_civiles: ModelEstadoCivil[] = [];
  clients: ModelCliente[] = [];
  ngOnInit(): void {
    this.GetAllCities();
    this.GetAllCivilStates();
    this.getAllClients();
  }


  GetAllCities() {
    this.clienteService.getCities().subscribe(
      (ciudad: any) => {
        this.ciudades = ciudad
        console.log(ciudad);
      },
      (error) => console.warn(error)
    )
  }

  GetAllCivilStates() {
    this.clienteService.getCivilStates().subscribe(
      (estado: any) => {
        this.estado_civiles = estado
        console.log(estado);
      },
      (error) => console.warn(error)
    )
  }

  validateNames(namesPer: string) {
    var expr: RegExp = /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/g;
    var verification = expr.test(namesPer);
    return verification;
  }

  validatePasswords(password: string) {
    var expr: RegExp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/g;
    var verification = expr.test(password);
    return verification;
  }

  validateMail(mail: string) {
    var expr: RegExp = /^([da-z_.-]+)@([da-z.-]+).([a-z.]{2,6})$/;
    var verification = expr.test(mail);
    return verification;
  }

  validateDNI(cedula: string) {
    if (cedula.length == 10) {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      if (tercerDigito < 6) {
        // El ultimo digito se lo considera dígito verificador
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(cedula.substring(9, 10));
        let suma: number = 0;
        let digito: number = 0;
        for (let i = 0; i < (cedula.length - 1); i++) {
          digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
          //      console.log(suma+" suma"+coefValCedula[i]); 
        }
        suma = Math.round(suma);
        //  console.log(verificador);
        //  console.log(suma);
        //  console.log(digito);
        if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
          return true;
        } else if ((10 - (Math.round(suma % 10))) == verificador) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // getClientByCedula() {
  //   this.clienteService.getClientsByCedula(this.clienteData.per_cedula).subscribe(
  //     (cliente: any) => {
  //       this.clientValidate = cliente;

  //     });

  //   console.log(this.clientValidate);
  //   if (this.clientValidate[0] != null) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  validateRegisteredDNI() {
    let validation = false;
    this.clients.forEach(client => {
      if (client.per_cedula == this.clienteData.per_cedula) {
        validation = true;
      }
    })
    return validation;
  }

  getAllClients() {
    this.clienteService.getAllClientes().subscribe(
      (cliente: ModelCliente[]) => {
        this.clients = cliente;
      });
  }

  viewPassword() {
    var tipo: HTMLInputElement = <HTMLInputElement>document.getElementById('password')!;
    let iconView = document.getElementById('viewP')!;
    if (tipo.type == "password") {
      tipo.type = "text";
      iconView.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      tipo.type = "password";
      iconView.innerHTML = '<i class="fas fa-eye"></i>';
    }
  }

  SignUp() {
    // console.log(this.clienteData)
    // utilizar try catch
    try {
      let warningDNI = document.getElementById('valueId')!;
      let warningNames = document.getElementById('valueNames')!;
      let warningAddress = document.getElementById('valueAddress')!;
      let warningPhone = document.getElementById('valuePhone')!;
      let warningMail = document.getElementById('valueMail')!;
      let warningPassword = document.getElementById('valuePassword')!;
      let warningCity = document.getElementById('valueCity')!;
      let warningStatus = document.getElementById('valueStatus')!;

      let comprobación = true;

      if (this.clienteData.per_cedula == '') {
        warningDNI.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateDNI(this.clienteData.per_cedula)) {
          if (this.validateRegisteredDNI()) {
            warningDNI.innerHTML = "<i class='fas fa-info-circle'></i> Cédula ya registrada.";
            warningDNI.style.display = 'block';
            comprobación = false;
          } else {
            warningDNI.style.display = 'none';
          }
        } else {
          warningDNI.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese una cédula correcta.";
          warningDNI.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.clienteData.per_nombres == '') {
        warningNames.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese sus nombres.";
        warningNames.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateNames(this.clienteData.per_nombres)) {
          warningNames.style.display = 'none';
        } else {
          warningNames.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese un nombre correcto.";
          warningNames.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.clienteData.per_direccion == '') {
        warningAddress.style.display = 'block';
        comprobación = false;
      } else {
        warningAddress.style.display = 'none';
      }

      if (this.clienteData.per_telefono == '') {
        warningPhone.style.display = 'block';
        comprobación = false;
      } else {
        warningPhone.style.display = 'none';
      }

      if (this.clienteData.per_correo == '') {
        warningMail.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese un correo electrónico.";
        warningMail.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateMail(this.clienteData.per_correo)) {
          warningMail.style.display = 'none';
        } else {
          warningMail.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese un correo válido.";
          warningMail.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.validatePasswords(this.clienteData.per_clave)) {
        warningPassword.style.display = 'none';
      } else {
        warningPassword.style.display = 'block';
        comprobación = false;
      }

      if (this.clienteData.per_ciudad == 'Ciudad' || this.clienteData.per_ciudad == '') {
        warningCity.style.display = 'block';
        comprobación = false;
      } else {
        warningCity.style.display = 'none';
      }

      if (this.clienteData.per_estadocivil == '' || this.clienteData.per_estadocivil == 'Estado Civil') {
        warningStatus.style.display = 'block';
        comprobación = false;
      } else {
        warningStatus.style.display = 'none';
      }


      if (comprobación) {
        this.clienteService.postClients(this.clienteData).subscribe((data: {}) => { })
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Su registro ha sido exitoso',
          showConfirmButton: false,
          timer: 1500
        })

        this.router.navigate(['/login']);


      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Revise si los datos ingresados son correctos.',
          showConfirmButton: false,
          timer: 2000
        })
      }

      return comprobación;
    } catch (error) {
      console.log(error);
      return false;
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Su registro ha fallado',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }


}
