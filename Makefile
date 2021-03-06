SASS_FILES=$(shell find sass/*.scss)
HAML_FILES=$(shell find *.haml)
# best done with watch make .css, watch make .html
.all: .css .html
	touch .all

.css: $(SASS_FILES)
	mkdir -p css
	sass --style compressed sass/all.scss:css/all.min.css
	touch .css

.html: $(HAML_FILES)
	haml index.haml index.html
