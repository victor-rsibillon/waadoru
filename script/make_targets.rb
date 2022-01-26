dictionary = []
targets = []

files = ['adj.tsv', 'interjection.tsv', 'noun.adverbal.tsv', 'noun.number.tsv', 'noun.tsv', 'noun.verbal.tsv',
         'verb.tsv']

files.each do |file|
  File.open(file) do |f|
    dictionary |= f.read.split
  end
end

File.open('kana-frequency-words.tsv') do |f|
  targets = f.read.split
end

targets &= dictionary

File.open('targets.json', 'w') do |f|
  f.write("[#{targets.sort.map { |w| "\"#{w}\"" }.join(',')}]")
end

puts("#{targets.size} words")
