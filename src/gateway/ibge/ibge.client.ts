import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class IbgeClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}
  async getCitiesByState(uf: string): Promise<any[]> {
    const params = {
      orderBy: 'nome',
    };

    this.logger.log(`Buscando cidades do estado com codigo ${uf}`);
    return await firstValueFrom(
      this.httpService
        .get(`/localidades/estados/${uf}/municipios`, {
          params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        )
        .pipe(map((response) => response.data))
        .pipe(
          map((data) => {
            return data.map((city: any) => {
              return {
                id: city.id,
                nome: city.nome,
                estado: city.microrregiao.mesorregiao.UF.sigla,
                regiao: city.microrregiao.mesorregiao.UF.regiao.nome,
              };
            });
          }),
        ),
    );
  }

  async getCityByCode(code: number): Promise<any> {
    const params = {
      orderBy: 'nome',
    };

    this.logger.log(`Buscando cidade com codigo ${code}`);
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/localidades/municipios/${code}`, {
          params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    if (!data.id) {
      return {
        id: null,
        nome: null,
        uf: null,
      };
    }

    return {
      id: data.id,
      nome: data.nome,
      uf: data.microrregiao.mesorregiao.UF.sigla,
    };
  }

  async isValidCity(city: string, code: number): Promise<any> {
    const findCity = await this.getCityByCode(code);
    if (findCity.id === null) {
      return false;
    }
    if (findCity.nome === city && findCity.id === code && findCity.uf) {
      return {
        isValid: true,
        city: {
          codigo_ibge: findCity.id,
          nome: findCity.nome,
          uf: findCity.uf,
        },
      };
    }
    return false;
  }
}
