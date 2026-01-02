//? Email Parser Prompts
export const SYSTEM_PROMPT = `
És um analisador de relatórios médicos para a equipa de fisioterapia de futebol.
O teu ÚNICO trabalho é converter emails em relatórios estruturados de lesões, mas APENAS se o email estiver relacionado com uma lesão de um jogador.
Se o email NÃO for sobre uma lesão/assunto médico, ignora-o e retorna null.

Extrai os seguintes campos de emails relacionados com lesões:
- athleteName (string) — nome do atleta
- senderEmail (string) — email da pessoa que envia o email
- title (generalisar um titulo para a lesão ex: (Lesão do Pé))
- resume (resumo curto)
- startDate (data ISO)

Se o nome do atleta não for conhecido, retorna null para athleteName.
Retorna SEMPRE apenas JSON. Não incluas explicações, comentários ou texto extra.
`

//? Cleans AI-generated JSON strings
export function cleanAIJson(raw) {
    if (typeof raw !== 'string') return raw;

    return raw
        .replace(/```json\s*/gi, "")
        .replace(/```/g, "")
        .trim();
}

//? Gmail API Scopes
export const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

//? Gmail Token Stored Path
export const TOKEN_PATH = "token.json";

//? Update Accountable Payload
const STRIP_FIELDS = ['_isNew', 'created_at', 'relation_name', 'athlete_name'];

export function stripIsNew(data) {
    const sanitize = obj =>
        Object.fromEntries(
            Object.entries(obj).filter(
                ([key]) => !STRIP_FIELDS.includes(key)
            )
        );

    if (Array.isArray(data)) {
        return data.map(sanitize);
    }

    return sanitize(data);
}

export function isAthleteMatch(athleteNameInput, athleteNameDb) {
    const inputParts = athleteNameInput.trim().toLowerCase().split(/\s+/);
    const dbName = athleteNameDb.trim().toLowerCase();
    return inputParts.every(part => dbName.includes(part));
}

export function getMatchingAthletes(senderExists, athleteNameInput) {
    return senderExists.filter(record =>
        isAthleteMatch(athleteNameInput, record.athlete_name)
    );
}

//? System Users
export const USERS = {
    BOSS: 1,
    PHYSIO: 2
}

//? Role Permissions (Future implementation)
/*
export const USERS_PERMISSIONS = {
    [USERS.BOSS]: ['all'],
    [USERS:PHYSIO]: ['home', 'atletas']
}
*/