import { ProgressBarProps } from '../../types'
import './ProgressBar.css'

function ProgressBar({ count, activeIndex, elapsed }: Readonly<ProgressBarProps>) {
  return (
    <div className="progress-bar">
      {Array.from({ length: count }, (_, i) => i).map((segIdx) => {
        let fillWidth: number
        if (segIdx < activeIndex) {
          fillWidth = 1
        } else if (segIdx === activeIndex) {
          fillWidth = elapsed
        } else {
          fillWidth = 0
        }

        return (
          <div className="progress-bar__segment" key={`segment-${segIdx}`}>
            <div
              className="progress-bar__fill"
              style={{ width: `${fillWidth * 100}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ProgressBar
