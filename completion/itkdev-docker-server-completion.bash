#/usr/bin/env bash
_ids_completions()
{
  local cur
  _get_comp_words_by_ref -n : cur

  if [ "${#COMP_WORDS[@]}" != "2" ]; then
    return
  fi

  # Keep the suggestions in a local variable
  local suggestions=($(compgen -W "--debug --env-file --root --compose --help" -- "${COMP_WORDS[1]}"))

  COMPREPLY=("${suggestions[@]}")

  __ltrim_colon_completions "$cur"
}

complete -F _ids_completions itkdev-docker-compose-server
complete -F _ids_completions idc
