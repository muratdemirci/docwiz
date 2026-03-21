import React from 'react'
import {
  Text,
  useTheme,
  Code,
  Description,
  Spacer,
  Badge,
  Button,
  Table,
} from '@geist-ui/react'
import { getMethodColor } from '../../../utils/postmanParser'
import { formatJson } from '../../../utils/formatJson'

/**
 * Reusable method badge component
 */
const MethodBadge = ({ method }) => {
  const color = getMethodColor(method)
  return (
    <span
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '2px 10px',
        borderRadius: 4,
        fontWeight: 'bold',
        fontSize: '0.85rem',
        marginRight: 8,
      }}
    >
      {method?.toUpperCase()}
    </span>
  )
}

/**
 * Reusable key-value table section
 * DRY: Used for headers and query params
 */
const KeyValueTable = ({ title, data, columns }) => {
  if (!data || data.length === 0) return null
  return (
    <>
      <Text h5 style={{ color: 'var(--accents-6)' }}>
        {title}
      </Text>
      <Table data={data}>
        {columns.map((col) => (
          <Table.Column key={col.prop} prop={col.prop} label={col.label} />
        ))}
      </Table>
      <Spacer h={1} />
    </>
  )
}

/**
 * JSON code block component
 * DRY: Used for request body and response bodies
 */
const JsonCodeBlock = ({ raw, style }) => {
  if (!raw) return null
  return (
    <Code block style={style}>
      {formatJson(raw)}
    </Code>
  )
}

/**
 * Response status badge color based on HTTP status code
 */
function getBadgeType(code) {
  if (code < 300) return 'success'
  if (code < 400) return 'warning'
  return 'error'
}

export const EndpointDetail = ({ item, onDownloadReadme }) => {
  const { palette } = useTheme()

  if (!item) return null

  const headers = (item.headers || [])
    .filter((h) => !h.disabled)
    .map((h) => ({
      key: h.key,
      value: h.value,
      description: h.description || '-',
    }))

  const queryParams = (item.queryParams || [])
    .filter((p) => !p.disabled)
    .map((p) => ({
      key: p.key,
      value: p.value,
      description: p.description || '-',
    }))

  return (
    <div data-testid="endpoint-detail">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text h3 style={{ color: palette.cyanDark }}>
          Endpoint Detayı
        </Text>
        <Button auto size="small" type="secondary" onClick={onDownloadReadme}>
          README Oluştur
        </Button>
      </div>

      <Spacer h={0.5} />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <MethodBadge method={item.method} />
        <Text b style={{ fontSize: '1.1rem' }}>
          {item.name}
        </Text>
      </div>

      <Code block style={{ marginBottom: 16 }}>
        {item.url || 'No URL'}
      </Code>

      {item.description && (
        <>
          <Description title="Açıklama" content={item.description} />
          <Spacer h={1} />
        </>
      )}

      <KeyValueTable
        title="Headers"
        data={headers}
        columns={[
          { prop: 'key', label: 'Key' },
          { prop: 'value', label: 'Value' },
          { prop: 'description', label: 'Açıklama' },
        ]}
      />

      <KeyValueTable
        title="Query Parametreleri"
        data={queryParams}
        columns={[
          { prop: 'key', label: 'Parametre' },
          { prop: 'value', label: 'Değer' },
          { prop: 'description', label: 'Açıklama' },
        ]}
      />

      {item.body?.raw && (
        <>
          <Text h5 style={{ color: palette.accents_6 }}>
            Request Body
          </Text>
          <JsonCodeBlock raw={item.body.raw} />
          <Spacer h={1} />
        </>
      )}

      {item.responses?.length > 0 && (
        <>
          <Text h5 style={{ color: palette.accents_6 }}>
            Yanıtlar
          </Text>
          {item.responses.map((resp, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <Badge type={getBadgeType(resp.code)}>
                {resp.code} {resp.status}
              </Badge>
              <Text small style={{ marginLeft: 8 }}>
                {resp.name}
              </Text>
              {resp.body && (
                <JsonCodeBlock raw={resp.body} style={{ marginTop: 8 }} />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
