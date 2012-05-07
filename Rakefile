task :default => [:jshint]

task :jshint do
	js_files = FileList.new('server.js', 'lib/**/*.js', 'public/**/*.js') do |fl|
		fl.exclude('public/bootstrap/**/*.js')
		fl.exclude('public/js/ext/**/*.js')
	end

	js_files.each do |file|
		#puts file
		sh "jshint #{file}" do |ok,res|
			puts ok
			puts res
		end
	end

end

