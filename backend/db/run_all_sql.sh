#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DB_HOST="${DB_HOST:-10.211.55.20}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-LinkedyouDev}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-password}"

usage() {
  cat <<'USAGE'
Usage:
  db/run_all_sql.sh
  DB_PASSWORD=<password> db/run_all_sql.sh
  db/run_all_sql.sh --host 10.211.55.20 --port 3306 --database LinkedyouDev --user root --password password

Options:
  --host       MySQL host. Default: DB_HOST or 10.211.55.20
  --port       MySQL port. Default: DB_PORT or 3306
  --database   Database name. Default: DB_NAME or LinkedyouDev
  --user       MySQL user. Default: DB_USER or root
  --password   MySQL password. Default: DB_PASSWORD or password
  -h, --help   Show this help.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      DB_HOST="$2"
      shift 2
      ;;
    --port)
      DB_PORT="$2"
      shift 2
      ;;
    --database)
      DB_NAME="$2"
      shift 2
      ;;
    --user)
      DB_USER="$2"
      shift 2
      ;;
    --password)
      DB_PASSWORD="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

cd "${PROJECT_ROOT}"

MYSQL_PWD="${DB_PASSWORD}" mysql \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --user="${DB_USER}" \
  --database="${DB_NAME}" \
  --execute="source db/0000_init_all.sql"
