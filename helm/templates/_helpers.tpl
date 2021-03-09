{{/*
Expand the name of the chart.
*/}}
{{- define "angularfrontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "angularfrontend.mariadb.fullname" -}}
{{- printf "%s-%s" .Release.Name "mariadb" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "angularfrontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "angularfrontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "angularfrontend.labels" -}}
helm.sh/chart: {{ include "angularfrontend.chart" . }}
{{ include "angularfrontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "angularfrontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "angularfrontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "angularfrontend.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "angularfrontend.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Return the MariaDB Hostname
*/}}
{{- define "angularfrontend.databaseHost" -}}
{{- if .Values.mariadb.enabled }}
    {{- if eq .Values.mariadb.architecture "replication" }}
        {{- printf "%s-%s" (include "angularfrontend.mariadb.fullname" .) "primary" | trunc 63 | trimSuffix "-" -}}
    {{- else -}}
        {{- printf "%s" (include "angularfrontend.mariadb.fullname" .) -}}
    {{- end -}}
{{- else -}}
    {{- printf "%s" .Values.externalDatabase.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB Port
*/}}
{{- define "angularfrontend.databasePort" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "3306" -}}
{{- else -}}
    {{- printf "%d" (.Values.externalDatabase.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB Database Name
*/}}
{{- define "angularfrontend.databaseName" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "%s" .Values.mariadb.auth.database -}}
{{- else -}}
    {{- printf "%s" .Values.externalDatabase.database -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB User
*/}}
{{- define "angularfrontend.databaseUser" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "%s" .Values.mariadb.auth.username -}}
{{- else -}}
    {{- printf "%s" .Values.externalDatabase.user -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB Secret Name
*/}}
{{- define "angularfrontend.databaseSecretName" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "%s" (include "angularfrontend.mariadb.fullname" .) -}}
{{- else if .Values.externalDatabase.existingSecret -}}
    {{- printf "%s" .Values.externalDatabase.existingSecret -}}
{{- else -}}
    {{- printf "%s-%s" (include "common.names.fullname" .) "externaldb" -}}
{{- end -}}
{{- end -}}
