import React from 'react'
import { Chart } from 'react-google-charts'
import { number } from 'yup'

// export const data = [
//   [
//     "info",
//     "Gols na Temporada",
//     "The Avengers",
//     "Transformers: Age of Extinction",
//   ],
//   [1, 37.8, 80.8, 41.8],
//   [2, 30.9, 69.5, 32.4],
//   [3, 25.4, 57, 25.7],
//   [4, 11.7, 18.8, 10.5],
//   [5, 11.9, 17.6, 10.4],
//   [6, 8.8, 13.6, 7.7],
//   [7, 7.6, 12.3, 9.6],
//   [8, 12.3, 29.2, 10.6],
//   [9, 16.9, 42.9, 14.8],
//   [10, 12.8, 30.9, 11.6],
//   [11, 5.3, 7.9, 4.7],
//   [12, 6.6, 8.4, 5.2],
//   [13, 4.8, 6.3, 3.6],
//   [14, 4.2, 6.2, 3.4],
// ];

export const options = {
  chart: {
    title: 'Box Office Earnings in First Two Weeks of Opening',
    subtitle: 'Informações sobre a temporada de 2022',
  },
}

export function GraficoTatico(infos: any) {
  // console.log(infos.infos[0].statistics);
  console.log(infos.infos[0].statistics)

  let texte: any[] = []

  // infos.infos[0].statistics.forEach((_element: any) => {
  //   console.log(_element.goals.total);
  //   texte.push(_element.goals.total);
  // });

  console.log(texte)

  // infos.infos[0].statistics.map((item: any, index: string) => {
  //   const data = [
  //     [
  //       "info",
  //       "Gols na Temporada",
  //       "The Avengers",
  //       "Transformers: Age of Extinction",
  //     ],
  //     [1, soma, 80.8, 41.8],
  //     [2, 30.9, 69.5, 32.4],
  //     [3, 25.4, 57, 25.7],
  //     [4, 11.7, 18.8, 10.5],
  //     [5, 11.9, 17.6, 10.4],
  //     [6, 8.8, 13.6, 7.7],
  //     [7, 7.6, 12.3, 9.6],
  //     [8, 12.3, 29.2, 10.6],
  //     [9, 16.9, 42.9, 14.8],
  //     [10, 12.8, 30.9, 11.6],
  //     [11, 5.3, 7.9, 4.7],
  //     [12, 6.6, 8.4, 5.2],
  //     [13, 4.8, 6.3, 3.6],
  //     [14, 4.2, 6.2, 3.4],
  //   ];
  // });

  // const data = [
  //   [
  //     'Element',
  //     'Informações referentes as medias na temporada',
  //     { role: 'style' },
  //   ],
  //   ['Copper', 8.94, '#b87333'], // RGB value
  //   ['Silver', 10.49, 'silver'], // English color name
  //   ['Gold', 19.3, 'gold'],
  //   ['Platinum', 21.45, 'color: #e5e4e2'], // CSS-style declaration
  // ]

  let cardRed: number = 0
  let cardyellow: number = 0
  let cardyellowred: number = 0

  const soma = infos.infos[0].statistics.map((_intem: any, _index: any) => {
    interface arreyCardsTipo {
      red: number
      yellow: number
      yellowred: number
    }

    const arreyCards: arreyCardsTipo[] = [_intem.cards]

    arreyCards.forEach((_intem: any) => {
      if (_intem.red != 0) {
        cardRed += _intem.red
      }
      if (_intem.yellow != 0) {
        cardyellow += _intem.yellow
      }
      if (_intem.yellowred != 0) {
        cardyellowred += _intem.yellowred
      }
    })

  })

  console.log(cardyellow)



  const data = [
    ['cartões', 'Totais de cartões'],
    // ['Work', 11],
    ['Amarelo e Vermelho', cardyellowred],
    ['Vermelho', cardRed],
    // ['Watch TV', 2],
    ['Amarelo', cardyellow],
  ]

  const options = {
    title: 'Totais de Cartões em toda a temporada',
  }

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={'100%'}
      height={'400px'}
    />
    // <Chart chartType="ColumnChart" width="100%" height="400px" data={data} />
  )
}
