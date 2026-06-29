import type { LogicFlow } from '@logicflow/core'

export default function registerPolyline(lf: LogicFlow) {
  lf.register('polyline', ({ PolylineEdge, PolylineEdgeModel }: any) => {
    class ConnectionModel extends PolylineEdgeModel {
      constructor(data: any, graphModel: any) {
        super(data, graphModel)
      }
    }

    return {
      view: PolylineEdge,
      model: ConnectionModel,
    }
  })
}
