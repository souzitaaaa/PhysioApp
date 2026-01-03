# PhysioApp

Projeto Physio

## Tarefas Track

## Web

- [ ] Data em Pt 10/12/2025
- [ ] Melhores Loading Lesões Fechadas
- [ ] Lesões Fechadas comparar com os Emails Recebidos (grafico)
- [ ] Notas Efetuadas comparar com os Lesões Fechadas (grafico)

## Mobile

- [ ]

## Comandos do git

Para trabalhar no github temos estes comandos

| Comando                                   | Ação                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `git clone <url>`                         | Faz o download (clona) de um repositório remoto para o computador.                  |
| `git status`                              | Mostra o estado atual do repositório (ficheiros modificados, não rastreados, etc.). |
| `git add <ficheiro>`                      | Adiciona um ficheiro específico à área de staging.                                  |
| `git add .`                               | Adiciona **todos os ficheiros modificados** à área de staging.                      |
| `git commit -m "mensagem"`                | Guarda as alterações adicionadas com uma mensagem descritiva.                       |
| `git log`                                 | Mostra o histórico de commits.                                                      |
| `git diff`                                | Mostra as diferenças entre o código atual e o último commit.                        |
| `git pull`                                | Atualiza o repositório local com as últimas alterações do remoto.                   |
| `git push`                                | Envia (publica) as alterações locais para o repositório remoto.                     |
| `git branch`                              | Lista as branches existentes.                                                       |
| `git checkout <nome> / git switch <nome>` | Muda para a branch especificada.                                                    |
| `git merge <branch>`                      | Junta as alterações de outra branch na branch atual.                                |

## Git tutorial

Para trabalhar vamos seguir este flow:

Primeiramente nunca trabalhamos diretamente na main, pk lá vai estar o nosso código a funcionar corretamente com 0 bugs

Começamos sempre por depois do clone (tendo em conta que estamos na main porque o checkout cria uma nova branch relativamente á atual que estamos):

```bash
  git checkout -b <nome>
```

Depois podemos fazer oque quiseremos nessa branch, ao acabarmos fazemos:

```bash
  git add .
```

```bash
  git commit -m <mensagem>
```

```bash
  git push
```

Depois isso fica guardado na nossa branch que criamos separada da main

Só quando tivermos a certeza que está tudo a correr como queremos, vamos ao github e abrimos um pull request da nossa branch para a main
