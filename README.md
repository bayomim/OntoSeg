# OntoSeg
OntoSeg: a Novel Approach to Text Segmentation using Ontological Similarity


Mostafa Bayomi, Killian Levacher, M.Rami Ghorab, Séamus Lawless,

ADAPT Centre, Knowledge and Data Engineering Group,

School of Computer Science and Statistics, Trinity College Dublin, Dublin, Ireland

Contact person: bayomim -at- tcd.ie

This is an implementatio for OntoSeg algorithm

The code is documented in general.

The algorithm is written with NodeJs. You need to instal dependencies first using the package-lock.json file.

Then run the code as follows:

    > node Start_OntoSeg.js
    
 This version of OntoSeg works on data provided by (Kazantseva & Szpakowicz 2014): http://anna-kazantseva.com/content/
 
 In order to run OntoSeg on your data, you need to convert your data into classes from DBpedia.
 
 To do so, use the helper system (https://github.com/bayomim/BuildVSM)

Please cite our paper if you publish material based on this code or dataset.

    @INPROCEEDINGS{7395815, 
    author={M. Bayomi and K. Levacher and M. R. Ghorab and S. Lawless}, 
    booktitle={2015 IEEE International Conference on Data Mining Workshop (ICDMW)}, 
    title={OntoSeg: A Novel Approach to Text Segmentation Using Ontological Similarity}, 
    year={2015}, 
    volume={}, 
    number={}, 
    pages={1274-1283}, 
    keywords={ontologies (artificial intelligence);pattern clustering;text analysis;HAC algorithm;NLP tasks;OntoSeg;document segmentation;document summarisation;hierarchical agglomerative clustering;information retrieval;lexical cohesion;lexical similarity;natural language processing tasks;ontological similarity;ontology-based IR systems;segmentation quality;semantic Web;similarity measure;text blocks;text representation;text segmentation;text subtopic structure;tree-like hierarchy;word-frequency metrics;Clustering algorithms;Hidden Markov models;Information retrieval;Measurement;Natural language processing;Ontologies;Semantics;Lexical Cohesion;Ontological similarity;Text Segmentation;Vector Space Model}, 
    doi={10.1109/ICDMW.2015.6}, 
    ISSN={}, 
    month={Nov},}

