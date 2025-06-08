export class Transports {
  public readonly rota: string;
  public readonly empresa: string;
  public readonly preco: number;
  public readonly distanciaKm: string;
  public readonly duracao: any;
  public readonly viaPrincipal: string | null | undefined;
  public readonly diaSemana: string;
  public readonly horarioPartida: string;
  public readonly horarioChegada: string;
  public readonly veiculo: string;
  constructor(
    rota: string,
    empresa: string,
    preco: number,
    distanciaKm: string,
    duracao: any,
    viaPrincipal: string | null | undefined,
    diaSemana: string,
    horarioPartida: string,
    horarioChegada: string,
    veiculo: string,
  ) {
    this.rota = rota;
    this.empresa = empresa;
    this.preco = preco;
    this.distanciaKm = distanciaKm;
    this.duracao = duracao;
    this.viaPrincipal = viaPrincipal;
    this.diaSemana = diaSemana;
    this.horarioPartida = horarioPartida;
    this.horarioChegada = horarioChegada;
    this.veiculo = veiculo;
  }
}
