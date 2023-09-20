import { Component } from '@angular/core';
import { COMERCIALDATA } from '../mocks/commercialData';
import { SHOPPINGCART } from '../mocks/shoppingCart';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {}
  public ngOnInit(): void {
    this.getListCentrex();
  }
  public mapCentrexList;
  public mapCentrex = { dataCentrex: [] };
  private setCentrex(mapCentralita): void {
    let centrexTypes = {};
    const ddiNumber: string[] = [];
    mapCentralita.forEach((obj) => {
      if (
        !centrexTypes[obj.svas[0].product.name] &&
        centrexTypes[obj.svas[0].product.name] !== 0
      ) {
        centrexTypes = { ...centrexTypes, [obj.svas[0].product.name]: 0 };
      }
      if (obj.svas[0].product.name.toLowerCase().includes('ddi')) {
        ddiNumber.push(obj.svas[0].product.name);
      } else {
        centrexTypes[obj.svas[0].product.name] =
          parseInt(
            obj.svas[0].product?.nameToPrint?.split('(')[1].replace(/\D/g, ''),
            10
          ) || obj.svas.length;
      }
    });
    centrexTypes['Numeraciones DDI Altas Nuevas'] = ddiNumber?.length || 0;
    const mapCentrexData = {
      ud_sede_1: centrexTypes['Básico IP'] || 0,
      ud_sede_2: centrexTypes['Básico DEC+base'] || 0,
      ud_sede_3: centrexTypes['Puesto Básico DEC 2'] || 0,
      ud_sede_4: centrexTypes['Avanzado IP'] || 0,
      ud_sede_5: centrexTypes['Recepcionista IP'] || 0,
      ud_sede_6: centrexTypes['Sala IP'] || 0,
      ud_m1: centrexTypes['Móvil básico'] || 0,
      ud_m2: centrexTypes['Móvil avanzado'] || 0,
      ud_m3: centrexTypes['Móvil terceros'] || 0,
      adic: centrexTypes['Numeraciones DDI Altas Nuevas'] || 0,
      ud_equipo: centrexTypes['Número de Switch'] || 0,
    };

    console.log('', mapCentrexData);
  }
  private setDDIsCentrexData(DDICentrex, mapCentrexData) {
    DDICentrex.forEach((DDI, index) => {
      const ddiNumber: string = DDI.product.characteristic.find(
        (char) => char.name === 'DDInumber'
      )?.value;
      const ddiOperator: string = DDI.product.characteristic.find(
        (char) => char.name === 'DDIoperator'
      )?.value;
      const propertyDOI: string = ddiOperator ? 'p_portada_' : 'p_nuevo_';
      mapCentrexData[`${propertyDOI}${index + 1}`] = true;
      mapCentrexData[`numero_${index + 1}`] = ddiNumber || '';
      mapCentrexData[`o_donante_${index + 1}`] = ddiOperator || '';
    });
    return mapCentrexData;
  }
  private setMobileCentrexData(mobileCentrex, mapCentrexData) {
    mobileCentrex.forEach((mobile, index) => {
      const phoneNumber: string =
        mobile.product.characteristic.find(
          (char) =>
            char.name.toLowerCase() === 'msisdn' ||
            char.name.toLowerCase() === 'tercerosnumber' ||
            char.name.toLowerCase() === 'centrexmobilenumber'
        )?.value || '';
      const centrexMobileType: string = this.findCentrexMobileId(mobile.id);
      mapCentrexData[centrexMobileType + index.toString()] = true;
      mapCentrexData[`movil_asociado_${index}`] = phoneNumber;
      mapCentrexData[`tipo_${index}`] = 'A';
    });
    return mapCentrexData;
  }
  private findCentrexMobileId(id: string): string {
    const centrexMobile: Record<string, string> = {
      '2VX9EJ': 'p_basico_',
      '2VX9F1': 'p_avanzado_',
      '2VCBGZ': 'p_terceros_',
    };
    return centrexMobile[id.split('-')[1]];
  }

  getListCentrex() {
    const commercialData: any = COMERCIALDATA;
    const test = commercialData.find((e) =>
      e.rates.find((s) => s.lineCentrex.listSVACentrex.length)
    );
    this.mapCentrexList = test.rates[0].lineCentrex;
    console.log('this.mapCentrexList', this.mapCentrexList);
    this.getMapArrayCentrex();
  }

  // arrayLineCentreMovil(arrayLineCentrexMovil, idLine) {
  //   arrayLineCentrexMovil.push({
  //     params: { siebelId: idLine },
  //     svas: this.getSvaOfShoppingCart(idLine, true),
  //   });
  // }
  arrayLineCentrex(listCentrex) {
    return listCentrex
      .filter((e) => {
        return e?.line?.title && !e.line.name.toLowerCase().includes('ddi');
      })
      .map((e) => e.line);
  }
  getMapArrayCentrex() {
    const arrayLineCentrexFijOthers: any = this.groupById(
      this.arrayLineCentrex(this.mapCentrexList.arrayLineCentrexFijoSelect)
    );
    console.log();

    let arrayLineCentrexFijoDdi: any[] = [];
    let arrayLineCentrexMovil: any[] = [];
    let arrayLineCentrexMovilTerceros: any[] = [];
    let arrayLineCentrexFijo: any[] = [];

    let siebelIdsMovilTerceros = ['1-2VCBGZ'];
    let siebelIdsMovilBasico = ['1-2VX9EJ'];
    let siebelIdsMovilAvanzado = ['1-2VX9F1'];
    let siebelIsdsDdi = ['1-369LB5', '1-369LAL', '1-369LBP', '1-369LC9'];
    this.arrayLineCentreMovil(arrayLineCentrexMovil, siebelIdsMovilBasico);
    this.arrayLineCentreMovil(arrayLineCentrexMovil, siebelIdsMovilAvanzado);
    this.arrayLineCentreMovil(
      arrayLineCentrexMovilTerceros,
      siebelIdsMovilTerceros
    );
    this.arrayLineCentreMovil(arrayLineCentrexFijoDdi, siebelIsdsDdi);
    arrayLineCentrexFijo = arrayLineCentrexFijOthers.concat(
      arrayLineCentrexFijoDdi
    );

    if (this.mapCentrexList.selectedSwitch) {
      const groupCentralita = this.groupById([{ id: '1-2VENTG-1' }]);
      this.mapCentrex.dataCentrex = arrayLineCentrexFijo
        .concat(
          arrayLineCentrexMovil,
          arrayLineCentrexMovilTerceros,
          groupCentralita
        )
        .filter((e) => e.svas.length);
      this.setCentrex(this.mapCentrex.dataCentrex);

      console.log(this.mapCentrex.dataCentrex);
    } else {
      this.mapCentrex.dataCentrex = arrayLineCentrexFijo
        .concat(arrayLineCentrexMovil, arrayLineCentrexMovilTerceros)
        .filter((e) => e.svas.length);
      this.setCentrex(this.mapCentrex.dataCentrex);
    }
    console.log('centrex', this.mapCentrex);
  }

  groupById(array: any[]) {
    const vm = this;
    let foundItem = { params: '', svas: [] };
    return array.reduce((acc, current) => {
      foundItem = acc.find((it) => it?.params?.siebelId === current.id);
      console.log('ddi', foundItem);
      if (foundItem) {
        foundItem.svas.push(vm.getSvaOfShoppingCart(current.id));
      } else {
        acc.push({
          params: { siebelId: current.id },
          svas: [vm.getSvaOfShoppingCart(current.id)],
        });
      }
      return acc;
    }, []);
  }
  arrayLineCentreMovil(arrayLineCentrexMovil: any[], idLine: any[]) {
    idLine.forEach((element) => {
      console.log(element);
      arrayLineCentrexMovil.push({
        params: { siebelId: element },
        svas: this.getSvaOfShoppingCart(element, true),
      });
    });
  }

  getSvaOfShoppingCart(idSva: string, isAgrup?: boolean) {
    const shoppingCart: any = SHOPPINGCART;
    if (shoppingCart && idSva) {
      let sva: any[] | any = [];

      shoppingCart.cartItem.forEach((cartItem1Level) => {
        cartItem1Level.cartItem.filter((cartItem2Level) => {
          try {
            if (
              cartItem2Level !== undefined &&
              cartItem2Level.id !== undefined
            ) {
              const isIdLevel: string = cartItem2Level.id.split('-')[1];
              if (isIdLevel === idSva.split('-')[1]) {
                if (isAgrup) {
                  sva.push(cartItem2Level);
                } else {
                  sva = cartItem2Level;
                }
              }
            }
          } catch {}
        });
      });
      return sva;
    }
  }
}
