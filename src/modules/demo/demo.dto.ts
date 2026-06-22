import { IsString, IsEmail, IsOptional, IsNumber, IsObject } from 'class-validator';

/**
 * DTO pour l'envoi d'email
 */
export class SendMailDto {
  @IsEmail({}, { message: 'L\'adresse email est invalide' })
  to: string;

  @IsString({ message: 'Le sujet est requis' })
  subject: string;

  @IsString({ message: 'Le corps du message est requis' })
  body: string;
}

/**
 * DTO pour le stockage en cache
 */
export class SetCacheDto {
  @IsString({ message: 'La clé est requise' })
  key: string;

  @IsString({ message: 'La valeur est requise' })
  value: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le TTL doit être un nombre (en secondes)' })
  ttl?: number;
}

/**
 * DTO pour l'ajout d'un job à la queue
 */
export class AddJobDto {
  @IsString({ message: 'Le nom du job est requis' })
  jobName: string;

  @IsOptional()
  @IsObject({ message: 'Les données doivent être un objet' })
  data?: Record<string, unknown>;

  @IsOptional()
  @IsNumber({}, { message: 'Le délai doit être un nombre (en ms)' })
  delayMs?: number;
}
