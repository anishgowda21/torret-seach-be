import * as cheerio from 'cheerio';
import axios from 'axios';
import { NyaaSearchResponse, NyaaTorrentResult } from '../types';

// Regex to extract name from the torrent
const nameRegex = /[a-zA-Z\W].+/g;

/**
 * Search for torrents on Nyaa.si
 */
export async function search(
  query: string, 
  ord_by: string = 'seeders', 
  page: number = 1
): Promise<NyaaSearchResponse> {
  try {
    // Convert 'date' ordering to 'id' as used by Nyaa.si
    const orderParam = ord_by === 'date' ? 'id' : ord_by;
    const baseUrl = `https://nyaa.si/?q=${query}&s=${orderParam}&o=desc&page=${page}`;
    
    const res = await axios.get(baseUrl);
    const $ = cheerio.load(res.data);
    
    const results: NyaaTorrentResult[] = await Promise.all(
      $('table > tbody > tr')
        .toArray()
        .map(async (el) => {
          const tds = $(el).find('td');
          const type = $(tds[0]).find('a').find('img').attr('alt') || '';
          const nameMatch = $(tds[1]).text().trim().match(nameRegex);
          const name = nameMatch ? nameMatch[0].trim() : '';
          const torrent = 'https://nyaa.si' + ($(tds[2]).find('a').first().attr('href') || '');
          const magnet = $(tds[2]).find('a').last().attr('href') || '';
          const size = $(tds[3]).text() || '';
          const upload_date = $(tds[4]).text().trim() || '';
          const seeders = $(tds[5]).text().trim() || '0';
          const leechers = $(tds[6]).text().trim() || '0';
          const complete_downloads = $(tds[7]).text().trim() || '0';

          return {
            type,
            name,
            torrent,
            magnet,
            size,
            upload_date,
            seeders,
            leechers,
            complete_downloads,
          };
        })
    );

    return {
      status: 'success',
      orderedBy: ord_by === 'id' ? 'date' : ord_by,
      query,
      length: results.length,
      page,
      data: results,
    };
  } catch (error) {
    return {
      status: 'error',
      orderedBy: ord_by === 'id' ? 'date' : ord_by,
      query,
      length: 0,
      page,
      data: [],
      error_code: (error as any).code,
      error_message: (error as Error).message,
      error_stack: (error as Error).stack,
    } as any;
  }
}

export default search;