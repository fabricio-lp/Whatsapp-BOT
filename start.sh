while :; do
  clear
  echo "INICIANDO..."

  echo "Verificando configs..."
  find . -type f -name "*.example" | while read -r example; do
    target="${example%.example}"
    if [ ! -f "$target" ]; then
      cp "$example" "$target"
      echo "Criado: $target"
    fi
  done
  echo "Configs OK"

  npm i

  node index.js
done
