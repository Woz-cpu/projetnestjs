import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger.log('Cache service initialisé avec Redis');
  }

  /**
   * Stocke une valeur dans le cache
   * @param key Clé de stockage
   * @param value Valeur à stocker
   * @param ttl Durée de vie en secondes (optionnel)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
    this.logger.debug(`Cache SET: ${key}`);
  }

  /**
   * Récupère une valeur du cache
   * @param key Clé de la valeur
   * @returns La valeur ou undefined si non trouvée
   */
  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    this.logger.debug(`Cache GET: ${key} -> ${value ? 'HIT' : 'MISS'}`);
    return value ?? undefined;
  }

  /**
   * Supprime une valeur du cache
   * @param key Clé à supprimer
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.debug(`Cache DEL: ${key}`);
  }

  /**
   * Réinitialise tout le cache
   */
  async reset(): Promise<void> {
    await this.cacheManager.clear();
    this.logger.warn('Cache RESET: tout le cache a été vidé');
  }

  /**
   * Récupère ou calcule une valeur (pattern cache-aside)
   * @param key Clé de cache
   * @param factory Fonction pour calculer la valeur si absente
   * @param ttl Durée de vie en secondes
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
}
