import { useState } from 'react'



type Preset = {
  label: string
  keys: Array<string>
}

export const AppFilter = ({
  apps,
  presets,
  defaultKeys,
  onChange,
}: {
  apps: Record<string, { label: string; color: string }>
  presets: Array<Preset>
  defaultKeys: Array<string>
  onChange: (selected: Array<string>) => void
}) => {

  const allKeys = Object.keys(apps)
  const [selected, setSelected] = useState<Array<string>>(defaultKeys)

  const toggle = (key: string) => {

    const next = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key]
    setSelected(next)
    onChange(next)
  }

  const applyPreset = (preset: Preset) => {

    setSelected(preset.keys)
    onChange(preset.keys)
  }

  return (
    <div className="app-filter">
      <div className="app-filter-presets">
        {presets.map(preset => (
          <button
            key={preset.label}
            type="button"
            className={`app-filter-preset ${JSON.stringify(selected.sort()) === JSON.stringify(preset.keys.sort()) ? 'active' : ''}`}
            onClick={() => applyPreset(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="app-filter-chips">
        {allKeys.map(key => {

          const app = apps[key]!
          const isSelected = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              className={`app-filter-chip ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: app.color,
                background: isSelected ? app.color : 'transparent',
                color: isSelected ? '#2b2b2b' : app.color,
              }}
              onClick={() => toggle(key)}
            >
              {app.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
